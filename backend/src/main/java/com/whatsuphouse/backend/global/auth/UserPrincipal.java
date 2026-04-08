package com.whatsuphouse.backend.global.auth;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Getter
public class UserPrincipal implements UserDetails {

    private final UUID userId;
    private final String email;
    private final boolean isAdmin;

    public UserPrincipal(UUID userId, String email, boolean isAdmin) {
        this.userId = userId;
        this.email = email;
        this.isAdmin = isAdmin;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (isAdmin) {
            return List.of(new SimpleGrantedAuthority("ROLE_USER"),
                           new SimpleGrantedAuthority("ROLE_ADMIN"));
        }
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return userId.toString();
    }
}
