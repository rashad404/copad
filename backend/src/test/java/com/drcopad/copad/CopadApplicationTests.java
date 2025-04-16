package com.drcopad.copad;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import com.drcopad.copad.config.TestConfig;

@SpringBootTest
@Import(TestConfig.class)
class CopadApplicationTests {

	@Test
	void contextLoads() {
	}

}
