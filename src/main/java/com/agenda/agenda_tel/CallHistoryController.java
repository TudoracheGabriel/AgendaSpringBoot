package com.agenda.agenda_tel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/calls")
public class CallHistoryController {

    @Autowired
    private CallHistoryRepository callHistoryRepository;

    // SAVING CALLS IN CALL HISTORY
    @PostMapping("/add")
    public ResponseEntity<String> addCall(@RequestBody CallHistory callHistory) {
        callHistoryRepository.save(callHistory);
        return ResponseEntity.ok("Apel salvat în istoric!");
    }

    // GETTING RECENT CALLS
    @GetMapping("/recent")
    public List<CallHistory> getRecentCalls() {
        return callHistoryRepository.findTop10ByOrderByTimestampDesc();
    }
}

