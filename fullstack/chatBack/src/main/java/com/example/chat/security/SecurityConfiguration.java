package com.example.chat.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Autowired
    AuthenticationManager authenticationManager;

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity httpSecurity, BCryptPasswordEncoder bCryptPasswordEncoder, UserDetailsService userDetailsService) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder =
                httpSecurity.getSharedObject(AuthenticationManagerBuilder.class);

        authenticationManagerBuilder
                .userDetailsService(userDetailsService)
                .passwordEncoder(bCryptPasswordEncoder);

        return authenticationManagerBuilder.build();
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless authentication
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Ensure CORS configuration is applied
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Stateless session
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/login").permitAll() // Allow /login without authentication
                        .requestMatchers(HttpMethod.GET, "/api/users/profile-image/**").permitAll() // Allow access to profile images for all users
                        .requestMatchers(HttpMethod.GET, "/api/users").hasAuthority("ADMIN") // Only ADMIN can access the list of users
                        .requestMatchers(HttpMethod.GET, "/api/users/{userId}").hasAnyAuthority("USER", "ADMIN") // User can access their own profile, ADMIN can access any profile
                        .requestMatchers(HttpMethod.POST, "/api/users").permitAll() // USER and ADMIN can create new users
                        .requestMatchers(HttpMethod.PUT, "/api/users/{userId}/status").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/{userId}").hasAuthority("ADMIN") // Only ADMIN can delete users
                        .requestMatchers(HttpMethod.POST, "/api/mail/send").hasAuthority("USER")
                        .requestMatchers(HttpMethod.GET, "/api/mail/user/{userId}").hasAuthority("USER")
                        .requestMatchers(HttpMethod.GET, "/api/mail/{mailId}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/sms/send").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/sms/user/{userId}").hasAuthority("USER")
                        .requestMatchers(HttpMethod.POST, "/api/twilio/makeCall").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/twilio/calls").permitAll()



                        .anyRequest().authenticated()) // Any other request requires authentication
                .addFilterBefore(new JWTAuthenticationFilter(authenticationManager), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(new JWTAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("http://localhost:4200"); // Angular app
        corsConfiguration.addAllowedMethod("*"); // All methods (GET, POST, etc.)
        corsConfiguration.addAllowedHeader("*"); // All headers
        corsConfiguration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        corsConfiguration.setExposedHeaders(List.of("Authorization")); // Expose Authorization header for CORS

        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration); // Apply CORS globally
        return source;
    }


}
