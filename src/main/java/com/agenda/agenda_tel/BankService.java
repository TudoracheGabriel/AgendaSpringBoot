package com.agenda.agenda_tel;

import com.agenda.agenda_tel.Transaction_history.Transaction;
import com.agenda.agenda_tel.Transaction_history.TransactionRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BankService {
    @Autowired
    private final BankRepository bankRepository;
    private final TransactionRepository transactionRepository;


    public BankService(BankRepository bankRepository, TransactionRepository transactionRepository) {
        this.bankRepository = bankRepository;
        this.transactionRepository=transactionRepository;
    }
    //METHOD FOR INITIALIZING AN ACCOUNT
    public void initializeBankAccount() {
        if (bankRepository.count() == 0) {
            Bank bank = new Bank();
            bank.setBalance(250.0);
            bank.setCreatedAt(LocalDateTime.now());
            bankRepository.save(bank);
        }
    }

    @PostConstruct
    public void init() {
        if (bankRepository.findById(1L).isEmpty()) {
            Bank bank = new Bank();
            bank.setId(1L);
            bank.setBalance(250.0);
            bank.setLoan(0.0);
            bankRepository.save(bank);
        }
    }

    //METHOD FOR WITHDRAWING MONEY
    @Transactional
    public String withdraw(Long id, double amount){
        Bank bank = bankRepository.findById(id).orElse(null);
        if (bank==null){
            throw new RuntimeException("Account not found");
        }
        if ((bank.getBalance() >= amount)){
            bank.setBalance(bank.getBalance()-amount);
            bankRepository.save(bank);
            Transaction transaction = new Transaction("Withdraw", amount, bank.getId());
            transactionRepository.save(transaction);
            return "Withdraw succesfully";
        } else {
            throw new RuntimeException("Insufficient balance");
        }
    }

    //METHOD FOR LOAN
    @Transactional
    public String loan(Long id, Double amount){
        Bank bank = bankRepository.findById(id).orElse(null);
        if (bank == null) {
            throw new RuntimeException("Account not found");
        }
        bank.setBalance(bank.getBalance()+amount);
        bankRepository.save(bank);
        Transaction transaction = new Transaction("Loan", amount, bank.getId());
        transactionRepository.save(transaction);
        return "Loan success";
    }

    //METHOD FOR GETTING BALANCE
    public  Double getBalance(Long id){
        Bank bank = bankRepository.findById(id).orElse(null);
        if (bank == null) {
            throw new RuntimeException("Account not found");
        }
        return bank.getBalance();
    }


}
