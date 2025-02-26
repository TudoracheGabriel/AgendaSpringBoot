package com.agenda.agenda_tel.Transaction_history;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String transactionType;
    private Double amount;
    private LocalDateTime timestamp;
    private Long bankId;

    public Transaction() {
    }

    public Transaction(String transactionType, Double amount, Long bankId) {
        this.transactionType = transactionType;
        this.amount = amount;
        this.bankId = bankId;
        this.timestamp = LocalDateTime.now();
    }

    public String getFormattedTimestamp() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
        return this.timestamp.format(formatter);
    }

    public Long getId() {
        return id;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public Double getAmount() {
        return amount;
    }

    public Long getBankId() {
        return bankId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
