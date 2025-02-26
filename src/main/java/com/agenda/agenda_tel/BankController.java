package com.agenda.agenda_tel;

import com.agenda.agenda_tel.Transaction_history.Transaction;
import com.agenda.agenda_tel.Transaction_history.TransactionRepository;
import com.agenda.agenda_tel.Transaction_history.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/bank")
public class BankController {
    private final BankService bankService;
    private final TransactionService transactionService;
    private final TransactionRepository transactionRepository; // Adăugat

    @Autowired
    public BankController(BankService bankService, TransactionService transactionService,TransactionRepository transactionRepository) {
        this.bankService = bankService;
        this.transactionService = transactionService;
        this.transactionRepository=transactionRepository;
    }

    // Endpoint pentru obținerea soldului
    @GetMapping("/balance/{id}")
    public ResponseEntity<Double> getBalance(@PathVariable Long id) {
        try {
            Double balance = bankService.getBalance(id);
            return ResponseEntity.ok(balance);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null);
        }
    }

    // Endpoint pentru retragerea banilor (withdraw)
    @PutMapping("/withdraw/{id}")
    public ResponseEntity<String> withdraw(@PathVariable Long id, @RequestBody Double amount) {
        try {
            String result = bankService.withdraw(id, amount);
            transactionRepository.save(new Transaction("Withdraw", amount, id));
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // Endpoint pentru împrumut (loan)
    @PutMapping("/loan/{id}")
    public ResponseEntity<String> loan(@PathVariable Long id, @RequestBody Double amount) {
        try {
            String result = bankService.loan(id, amount);
            transactionRepository.save(new Transaction("Loan", amount, id));
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // TRANSACTION LIST
    @GetMapping("/transactions/{id}")
    public ResponseEntity<List<Map<String, String>>> getTransactions(@PathVariable Long id) {
        List<Map<String, String>> formattedTransactions = transactionService.getLast10Transactions(id)
                .stream()
                .map(transaction -> Map.of(
                        "transactionType", transaction.getTransactionType(),
                        "amount", String.valueOf(transaction.getAmount()),
                        "formattedTimestamp", transaction.getFormattedTimestamp()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(formattedTransactions);
    }




}
