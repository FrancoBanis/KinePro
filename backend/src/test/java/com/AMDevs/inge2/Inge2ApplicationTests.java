package com.AMDevs.inge2;

import com.AMDevs.inge2.entity.RolUsuarios;
import com.AMDevs.inge2.entity.Usuario;
import com.AMDevs.inge2.repository.DataLoader;
import com.AMDevs.inge2.repository.UsuarioRepository;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class Inge2ApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private UsuarioRepository usuarioRepository;

	@Autowired
	private DataLoader dataLoader;

	@Test
	void contextLoads() {
	}

	@Test
	@WithMockUser(roles = "ADMIN")
	void adminCanListEmployeesAfterDataInitialization() throws Exception {
		Usuario employee = usuarioRepository.save(new Usuario(
				"Ana",
				"Profesional",
				"ana.profesional@example.com",
				LocalDate.of(1996, 1, 1),
				12345678,
				RolUsuarios.ROLE_PROFESIONALES,
				"activa"
		));

		dataLoader.run();

		mockMvc.perform(get("/api/auth/users/employees")
					.header("Origin", "http://localhost:5173"))
				.andExpect(status().isOk())
				.andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
				.andExpect(jsonPath("$[0].id").value(employee.getId()))
				.andExpect(jsonPath("$[0].email").value(employee.getEmail()));
	}

}
