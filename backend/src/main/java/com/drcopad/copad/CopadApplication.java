package com.drcopad.copad;

import com.drcopad.copad.config.ChatGPTConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(ChatGPTConfig.class)
public class CopadApplication {

	public static void main(String[] args) {
		SpringApplication.run(CopadApplication.class, args);
	}

}
