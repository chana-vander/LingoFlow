// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-topics',
//   imports: [],
//   templateUrl: './topics.component.html',
//   styleUrl: './topics.component.css'
// })
// export class TopicsComponent {
// }
// src/app/components/topics/topics.component.ts

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TopicService } from '../../service/topic.service'; 
import { Topic } from '../../models/topic'; 

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './topics.component.html', // הפניה לקובץ ה-HTML
  styleUrls: ['./topics.component.css'] // הפניה לקובץ ה-CSS
})
export class TopicsComponent implements OnInit {
  private topicService = inject(TopicService);
  private fb = inject(FormBuilder);

  topics: Topic[] = [];
  showAddForm = false;
  editingTopic: Topic | null = null;
  topicForm: FormGroup;

  constructor() {
    this.topicForm = this.fb.group({
      name: ['', Validators.required],
      translation: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTopics();
  }

  loadTopics(): void {
    this.topicService.getTopics().subscribe({
      next: (topics) => {
        this.topics = topics;
      },
      error: (error) => {
        console.error('Error loading topics:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.topicForm.valid) {
      const topicData = this.topicForm.value;
            if (this.editingTopic) {
        this.topicService.updateTopic(this.editingTopic.id, topicData).subscribe({
          next: () => {
            this.loadTopics();
            this.cancelEdit();
          },
          error: (error) => {
            console.error('Error updating topic:', error);
          }
        });
      } else {
        this.topicService.createTopic(topicData).subscribe({
          next: () => {
            this.loadTopics();
            this.cancelEdit();
          },
          error: (error) => {
            console.error('Error creating topic:', error);
          }
        });
      }
    }
  }

  editTopic(topic: Topic): void {
    this.editingTopic = topic;
    this.showAddForm = true;
    this.topicForm.patchValue({
      name: topic.name,
      translation: topic.translation,
      description: topic.description
    });
  }

  deleteTopic(id: number): void {
    if (confirm('האם אתה בטוח שברצונך למחוק נושא זה?')) {
      this.topicService.deleteTopic(id).subscribe({
        next: () => {
          this.loadTopics();
        },
        error: (error) => {
          console.error('Error deleting topic:', error);
        }
      });
    }
  }

  cancelEdit(): void {
    this.showAddForm = false;
    this.editingTopic = null;
    this.topicForm.reset();
  }
}