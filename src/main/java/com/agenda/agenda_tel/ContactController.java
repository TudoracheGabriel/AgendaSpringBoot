package com.agenda.agenda_tel;

import com.agenda.agenda_tel.Contact;
import com.agenda.agenda_tel.ContactService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://127.0.0.1:5500")  // Grants access to front-end
@RestController
@RequestMapping("/contacts") // Base route for all methods
public class ContactController {

    private final ContactService contactService;

    // Constructor dependency injection
    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }


    @GetMapping
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Contacts API is running");
    }

    //Endpoint GET for receiving all contacts from database
    @GetMapping("/all")
    public List<Contact> getAllContacts() {
        return contactService.getAllContacts();
    }

    // Endpoint POST for adding a contact
    @PostMapping("/add")
    public ResponseEntity<String> addContact(@RequestBody Contact contact) {
        try {
            contactService.saveContact(contact);
            return ResponseEntity.ok("Contactul a fost adăugat cu succes!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Eroare la adăugarea contactului.");
        }
    }

    // Endpoint for deleting a contact after name
    @DeleteMapping("/delete/{name}")
    public ResponseEntity<String> deleteContact(@PathVariable String name) {
        try {
            Optional<Contact> contact = contactService.getAllContacts()
                    .stream()
                    .filter(c -> c.getName().equals(name))
                    .findFirst();

            if (contact.isPresent()) {
                contactService.deleteByName(name);
                return ResponseEntity.ok("Contact șters cu succes!");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Contactul nu a fost găsit.");
            }
        } catch (Exception e) {
            e.printStackTrace();  // Print error in log
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Eroare la ștergerea contactului.");
        }
    }


    // Endpoint GET to return a contact by the name
    @GetMapping("/{name}")
    public ResponseEntity<String> getContactByName(@PathVariable String name) {
        Optional<Contact> contact = contactService.getAllContacts()
                .stream()
                .filter(c -> c.getName().equals(name))
                .findFirst();
        if (contact.isPresent()) {
            return ResponseEntity.ok("Nume: " + contact.get().getName() + ", Telefon: " + contact.get().getPhoneNumber());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Contactul cu numele " + name + " nu a fost găsit!");
        }
    }

    // Endpoint PUT to update the phone number by the name
    @PutMapping("/update/{name}")
    public ResponseEntity<String> updatePhoneNumber(@PathVariable String name, @RequestBody String newPhoneNumber) {
        // Delete all the characters that don't apply
        newPhoneNumber = newPhoneNumber.replaceAll("[^0-9]", ""); // Păstrează doar cifrele

        Optional<Contact> contact = contactService.getAllContacts()
                .stream()
                .filter(c -> c.getName().equals(name))
                .findFirst();

        if (contact.isPresent()) {
            contact.get().setPhoneNumber(newPhoneNumber);
            contactService.saveContact(contact.get());
            return ResponseEntity.ok("Numărul de telefon al contactului " + name + " a fost actualizat cu succes!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nu s-a găsit un contact cu numele " + name);
        }
    }
}
