package com.drcopad.copad;

import com.drcopad.copad.config.ChatGPTConfig;
import com.drcopad.copad.config.OpenAIResponsesConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableConfigurationProperties({ChatGPTConfig.class, OpenAIResponsesConfig.class})
@EnableAsync
@EnableScheduling
public class CopadApplication {

	public static void main(String[] args) {
		SpringApplication.run(CopadApplication.class, args);
	}

}
