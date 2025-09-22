
"use client";

import { useState } from "react";
import type { EmergencyContact } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Phone, User } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";


const mockContacts: EmergencyContact[] = [
    { id: '1', name: 'Jane Doe', phone: '555-123-4567', initials: 'JD'},
    { id: '2', name: 'John Smith', phone: '555-987-6543', initials: 'JS'},
    { id: '3', name: 'Mom', phone: '555-555-5555', initials: 'M'},
];


export function EmergencyContacts() {
    const [contacts, setContacts] = useState<EmergencyContact[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const addContact = (contact: EmergencyContact) => {
        if (!contacts.find(c => c.id === contact.id)) {
            setContacts(prev => [...prev, contact]);
            toast({
                title: "Contact Added",
                description: `${contact.name} has been added to your emergency contacts.`,
            })
        } else {
             toast({
                title: "Contact Already Added",
                description: `${contact.name} is already in your emergency contacts.`,
                variant: "destructive"
            })
        }
        setIsDialogOpen(false);
    }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Emergency Contacts</CardTitle>
          <CardDescription>
            Notify these contacts if you miss a dose.
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Contact
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select a Contact</DialogTitle>
                    <DialogDescription>
                        Choose a contact from your address book. This is a simulation.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 py-4">
                    {mockContacts.map(contact => (
                        <div key={contact.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarFallback className="bg-accent text-accent-foreground">{contact.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{contact.name}</p>
                                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => addContact(contact)}>Add</Button>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {contacts.length > 0 ? (
            <div className="space-y-4">
                {contacts.map(contact => (
                    <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-4">
                            <Avatar>
                               <AvatarFallback className="bg-primary text-primary-foreground">{contact.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{contact.name}</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Phone className="w-3 h-3"/>
                                    {contact.phone}
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setContacts(prev => prev.filter(c => c.id !== contact.id))}>Remove</Button>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center text-muted-foreground py-10">
                <User className="mx-auto h-12 w-12" />
                <p className="mt-4">No emergency contacts added yet.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

    