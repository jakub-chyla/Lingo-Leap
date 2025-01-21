package com.lingo_leap.dto;

import lombok.Data;

@Data
public class AuthenticationResponseDto {
    private Long Id;
    private String accessToken;
    private String refreshToken;
    private String message;

}
