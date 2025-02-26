package com.agenda.agenda_tel.Transaction_history;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<Transaction> getLast10Transactions(Long bankId) {
        return transactionRepository.findTop10ByBankIdOrderByTimestampDesc(bankId);
    }
}
