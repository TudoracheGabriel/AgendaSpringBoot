package com.agenda.agenda_tel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
public class DataInitializer {

    @Autowired
    private BankService bankService;

    @PostConstruct
    public void init() {
        // Apelăm metoda de inițializare a contului bancar la pornirea aplicației
        bankService.initializeBankAccount();
    }
}

