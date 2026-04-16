package com.whatsuphouse.backend.domain.user;

import com.whatsuphouse.backend.domain.user.enums.Gender;
import com.whatsuphouse.backend.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 10)
    private Gender gender;

    @Column(nullable = false, length = 10)
    private String age;

    @Column(nullable = false, unique = true, length = 50)
    private String nickname;

    @Column(nullable = false, length = 11)
    private String phone;

    @Column(name = "is_admin", nullable = false)
    private boolean isAdmin = false;

    @Builder
    public User(String email, String password, String name, Gender gender, String age, String nickname, String phone) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.gender = gender;
        this.age = age;
        this.nickname = nickname;
        this.phone = phone;
    }

    public void updateProfile(String name, Gender gender, String age, String nickname, String phone) {
        this.name = name;
        this.gender = gender;
        this.age = age;
        this.nickname = nickname;
        this.phone = phone;
    }
}
