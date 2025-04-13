package com.lingo_leap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.LocalDate;

@SpringBootApplication
public class LingoLeapApplication {

	public static void main(String[] args) {
		System.out.println(LocalDate.now());
		SpringApplication.run(LingoLeapApplication.class, args);

	}

}
