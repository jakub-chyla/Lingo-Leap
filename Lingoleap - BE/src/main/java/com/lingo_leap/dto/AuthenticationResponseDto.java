package com.lingo_leap.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AuthenticationResponseDto {
    private Long Id;
    private String accessToken;
    private String refreshToken;
    private String message;

}
