package com.agenda.agenda_tel;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    // Constructor for Dependency Injection
    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    // Method for receiving all contacts
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    //Method for saving a contact
    public Contact saveContact(Contact contact) {
        return contactRepository.save(contact);
    }

    //Method for deleting a contact
    public void deleteByName(String name) {
        // Searching a contact by its name
        Optional<Contact> contact = contactRepository.findByName(name).stream().findFirst();

        if (!contact.isPresent()) {
            throw new RuntimeException("Contactul cu numele " + name + " nu a fost găsit.");
        }

        // Delete the contact found
        contactRepository.delete(contact.get());
    }


}

