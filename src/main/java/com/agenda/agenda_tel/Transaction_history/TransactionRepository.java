package com.agenda.agenda_tel.Transaction_history;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findTop10ByBankIdOrderByTimestampDesc(Long bankId);
}
