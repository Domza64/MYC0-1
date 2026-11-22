package org.myco_1.player.util;

import lombok.RequiredArgsConstructor;
import org.myco_1.player.feature.user.Role;
import org.myco_1.player.feature.user.UserEntity;
import org.myco_1.player.feature.user.UserRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class StartupRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() {

        if (userRepository.findAll().isEmpty()) {
            UserEntity admin = new UserEntity(
                    "admin",
                    Set.of(Role.ADMIN),
                    passwordEncoder.encode("admin")
            );

            userRepository.save(admin);
        }
    }
}
