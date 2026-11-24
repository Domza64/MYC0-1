package org.myco_1.player.feature.user;

import lombok.RequiredArgsConstructor;
import org.myco_1.player.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserEntity getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User %s not found".formatted(userId)));
    }
}
