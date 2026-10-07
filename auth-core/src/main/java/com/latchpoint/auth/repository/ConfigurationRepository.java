package com.latchpoint.auth.repository;
import com.latchpoint.auth.model.FrameworkConfiguration; import org.springframework.data.jpa.repository.JpaRepository;
public interface ConfigurationRepository extends JpaRepository<FrameworkConfiguration,Long>{}
