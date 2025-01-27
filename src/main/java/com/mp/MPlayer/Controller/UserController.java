package com.mp.MPlayer.Controller;

import com.mp.MPlayer.Model.CustomUser;
import com.mp.MPlayer.Service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller
public class UserController {

    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/register")
    public void registerUser(@ModelAttribute CustomUser customUser){
        userService.registerCustomUser(customUser);
    }

}
