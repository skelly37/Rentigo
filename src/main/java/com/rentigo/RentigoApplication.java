package com.rentigo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.rentigo")
public class RentigoApplication {

    public static void main(String[] args) {
        SpringApplication.run(RentigoApplication.class, args);
    }
}
