package com.nmit.dutyexchange;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class DutyExchangeApplication {

	public static void main(String[] args) {
		SpringApplication.run(DutyExchangeApplication.class, args);
	}

}
