import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

  faqEntries = [
    {
      question: '1. What\'s this app?',
      answer: 'This app was created to get an overview about all rooms in your dormintory. ' +
      'Tell other people you live with whats going on in your room. ' +
      'Are you partying, sleeping, or just have a couple of drinks?'
    },
    {
      question: '2. In what dorms can you use this app?',
      answer: 'It is supposed to be used in the dorm Khlopina 9k2 (House 8).'
    },
    {
      question: '3. Who created this app?',
      answer: 'This app was created by Marco P. (Backend, Server) and Alex M. (Frontend, User Interface).'
    },
    {
      question: '4. I can\'t register with my room, what to do?',
      answer: 'Only 3 people can register for the same room. Please contact Marco or Alex.'
    },
    {
      question: '5. Can I support this app somehow?',
      answer: 'Yes, by donating a small amount or leaving feedback. Or both.'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
