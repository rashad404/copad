package com.drcopad.copad;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import com.drcopad.copad.config.TestConfig;

// Without the profile this reached for the real datasource, so the one test
// that checks the whole context can start has never actually started it.
@SpringBootTest
@ActiveProfiles("test")
@Import(TestConfig.class)
class CopadApplicationTests {

	@Test
	void contextLoads() {
	}

}
