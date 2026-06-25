package com.wongola.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.wongola")
public class WongolaApplication {
    public static void main(String[] args) {
        SpringApplication.run(WongolaApplication.class, args);
    }
}
