import { examinerConfig } from './config';

export interface ExaminerMessage {
  role: 'assistant' | 'user';
  content: string;
}

export class IELTSExaminer {
  private partNumber: 1 | 2 | 3;
  private config: (typeof examinerConfig)[1 | 2 | 3];
  private messages: ExaminerMessage[] = [];
  private currentTopic: string | null = null;
  private startTime: number | null = null;

  constructor(partNumber: 1 | 2 | 3) {
    this.partNumber = partNumber;
    this.config = examinerConfig[partNumber];
    this.messages = [
      {
        role: 'assistant',
        content: this.config.initialMessage,
      },
    ];
    this.startTime = Date.now();
  }

  public getSystemPrompt(): string {
    return this.config.systemPrompt;
  }

  public getMessages(): ExaminerMessage[] {
    return this.messages;
  }

  public addUserMessage(content: string) {
    this.messages.push({
      role: 'user',
      content,
    });
  }

  public addExaminerMessage(content: string) {
    this.messages.push({
      role: 'assistant',
      content,
    });
  }

  public getRandomTopic(): string {
    const availableTopics = this.config.topics.filter(
      (topic) => topic !== this.currentTopic
    );
    const randomIndex = Math.floor(Math.random() * availableTopics.length);
    this.currentTopic = availableTopics[randomIndex];
    return this.currentTopic;
  }

  public getRandomFollowUp(): string {
    const randomIndex = Math.floor(
      Math.random() * this.config.followUpQuestions.length
    );
    return this.config.followUpQuestions[randomIndex];
  }

  public getElapsedTime(): number {
    if (!this.startTime) return 0;
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  public isTimeUp(): boolean {
    const maxDuration = this.partNumber === 2 ? 120 : 300; // 2 minutes for part 2, 5 minutes for others
    return this.getElapsedTime() >= maxDuration;
  }

  public generateNextPrompt(): string {
    const elapsedTime = this.getElapsedTime();

    // Part-specific logic
    switch (this.partNumber) {
      case 1:
        // Change topic every ~90 seconds
        if (elapsedTime % 90 === 0) {
          return `Let's move on to a different topic. ${this.getRandomTopic()}?`;
        }
        return this.getRandomFollowUp();

      case 2:
        if (elapsedTime === 0) {
          const topic = this.getRandomTopic();
          return `Here's your topic: ${topic}\n\nYou should say:\n- What it is\n- Why it's important\n- How it affects you\n- And explain why you chose to talk about this\n\nYou have one minute to prepare. You can make notes if you wish.`;
        }
        if (elapsedTime === 60) {
          return 'Okay, now please begin speaking.';
        }
        if (this.isTimeUp()) {
          return "Thank you. That's the end of Part 2.";
        }
        return '';

      case 3:
        if (elapsedTime % 60 === 0) {
          const topic = this.getRandomTopic();
          return `Let's consider ${topic}. What are your thoughts on this?`;
        }
        return this.getRandomFollowUp();

      default:
        return '';
    }
  }

  public generateFinalPrompt(): string {
    switch (this.partNumber) {
      case 1:
        return "Thank you. That's the end of Part 1. Now, let's move on to Part 2.";
      case 2:
        return "Thank you. Now, let's move on to Part 3, where we'll discuss some more general questions.";
      case 3:
        return "Thank you. That's the end of the speaking test.";
      default:
        return '';
    }
  }
}
