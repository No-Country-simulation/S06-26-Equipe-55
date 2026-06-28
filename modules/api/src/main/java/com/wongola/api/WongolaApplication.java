package com.wongola.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.wongola")
@EntityScan(basePackages = "com.wongola.core.entity")
@EnableJpaRepositories(basePackages = "com.wongola.core.repository")
public class WongolaApplication {
    public static void main(String[] args) {
        SpringApplication.run(WongolaApplication.class, args);
    }
}
