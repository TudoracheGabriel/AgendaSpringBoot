package com.agenda.agenda_tel;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    void deleteByName(String name);
    List<Contact> findByName(String name);
}


