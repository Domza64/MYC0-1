package org.myco_1.player.feature.user;

import lombok.RequiredArgsConstructor;
import org.myco_1.player.exception.NotAllowedException;
import org.myco_1.player.exception.ResourceNotFoundException;
import org.myco_1.player.security.MycoUserDetails;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final SessionRegistry sessionRegistry;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserEntity getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User %s not found".formatted(userId)));
    }

    public List<UserResponse> getUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::from)
                .toList();
    }

    public UserResponse createUser(CreateUserRequest createUserRequest) {
        if (usernameExists(createUserRequest.username())) {
            throw new UsernameAlreadyExistsException("Username %s already exists.".formatted(createUserRequest.username()));
        }

        UserEntity userEntity = new UserEntity(
                createUserRequest.username(),
                createUserRequest.role(),
                passwordEncoder.encode(createUserRequest.password())
        );
        userRepository.save(userEntity);
        return UserResponse.from(userEntity);
    }

    public UserResponse updateUser(MycoUserDetails currentUser, Long userId, UpdateUserRequest updateUserRequest) {
        if (usernameExists(updateUserRequest.username())) {
            throw new UsernameAlreadyExistsException("Username %s already exists.".formatted(updateUserRequest.username()));
        }

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean editingSelf = currentUser.getUserId().equals(userId);

        if (!editingSelf && !isAdmin) {
            throw new NotAllowedException("You are not allowed to update this user");
        }
        if (!isAdmin && updateUserRequest.role() != null) {
            throw new NotAllowedException("You are not allowed to change anyone's role");
        }

        UserEntity user = getUser(userId);
        if (updateUserRequest.username() != null) {
            user.setUsername(updateUserRequest.username());
        }
        if (updateUserRequest.password() != null) {
            user.setPassword(passwordEncoder.encode(updateUserRequest.password()));
        }
        if (updateUserRequest.role() != null) {
            if (editingSelf && updateUserRequest.role() != Role.ADMIN) {
                throw new NotAllowedException("Admin role comes with great responsibility... You can't throw it away just like that.");
            } else {
                user.setRole(updateUserRequest.role());
            }
        }

        userRepository.save(user);

        if (editingSelf) {
            refreshCurrentAuthentication(user);
        } else {
            invalidateUserSessions(user);
        }
        return UserResponse.from(user);
    }

    public void deleteUser(MycoUserDetails currentUser, Long userId) {
        if (currentUser.getUserId().equals(userId)) {
            throw new NotAllowedException("If you delete yourself, you won't be able to use MYCO anymore :(");
        }

        getUser(userId); // Throws error if user doesn't exist

        userRepository.deleteById(userId);
    }

    private void invalidateUserSessions(UserEntity user) {
        MycoUserDetails principal = new MycoUserDetails(user);

        sessionRegistry.getAllSessions(principal, false)
                .forEach(SessionInformation::expireNow);
    }

    private void refreshCurrentAuthentication(UserEntity user) {
        MycoUserDetails newUserDetails = new MycoUserDetails(user);
        Authentication updated = new UsernamePasswordAuthenticationToken(
                newUserDetails,
                null,
                newUserDetails.getAuthorities()
        );

        SecurityContextHolder.getContext().setAuthentication(updated);
    }

    private boolean usernameExists(String username) {
        return userRepository.findByUsername(username).isPresent();
    }
}
