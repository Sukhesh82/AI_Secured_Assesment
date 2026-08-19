package com.examguard.config;

import com.examguard.entity.*;
import com.examguard.entity.enums.Difficulty;
import com.examguard.entity.enums.Role;
import com.examguard.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ExamQuestionRepository examQuestionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            seedUsers();
            seedQuestionsAndExam();
        }
    }

    private void seedUsers() {
        // Admin
        User admin = User.builder()
                .name("System Administrator")
                .email("admin@gmail.com")
                .password(passwordEncoder.encode("Admin@123"))
                .role(Role.ADMIN)
                .enabled(true)
                .build();
        userRepository.save(admin);

        // Student 1
        User student1 = User.builder()
                .name("Demo Student")
                .email("student@gmail.com")
                .password(passwordEncoder.encode("Student@123"))
                .role(Role.STUDENT)
                .studentId("ST101")
                .enabled(true)
                .build();
        userRepository.save(student1);

        // Student 2
        User student2 = User.builder()
                .name("Rahul Sharma")
                .email("rahul@gmail.com")
                .password(passwordEncoder.encode("Student@123"))
                .role(Role.STUDENT)
                .studentId("ST102")
                .enabled(true)
                .build();
        userRepository.save(student2);

        // Student 3
        User student3 = User.builder()
                .name("Priya Verma")
                .email("priya@gmail.com")
                .password(passwordEncoder.encode("Student@123"))
                .role(Role.STUDENT)
                .studentId("ST103")
                .enabled(true)
                .build();
        userRepository.save(student3);
    }

    private void seedQuestionsAndExam() {
        // 10 DSA Questions
        Question q1 = Question.builder()
                .questionText("Which data structure follows the First In First Out (FIFO) principle?")
                .optionA("Stack")
                .optionB("Queue")
                .optionC("Tree")
                .optionD("Graph")
                .correctAnswer("B")
                .marks(2.0)
                .difficulty(Difficulty.EASY)
                .subject("Data Structures")
                .build();

        Question q2 = Question.builder()
                .questionText("Which tree traversal algorithm processes nodes in sorted order for a Binary Search Tree (BST)?")
                .optionA("Preorder Traversal")
                .optionB("Inorder Traversal")
                .optionC("Postorder Traversal")
                .optionD("Level Order Traversal")
                .correctAnswer("B")
                .marks(2.0)
                .difficulty(Difficulty.MEDIUM)
                .subject("Data Structures")
                .build();

        Question q3 = Question.builder()
                .questionText("What is the worst-case time complexity of QuickSort?")
                .optionA("O(N log N)")
                .optionB("O(N)")
                .optionC("O(N^2)")
                .optionD("O(log N)")
                .correctAnswer("C")
                .marks(2.0)
                .difficulty(Difficulty.MEDIUM)
                .subject("Algorithms")
                .build();

        Question q4 = Question.builder()
                .questionText("Which data structure is primarily used to implement Breadth-First Search (BFS) on a graph?")
                .optionA("Stack")
                .optionB("Queue")
                .optionC("Priority Queue")
                .optionD("Array")
                .correctAnswer("B")
                .marks(2.0)
                .difficulty(Difficulty.EASY)
                .subject("Data Structures")
                .build();

        Question q5 = Question.builder()
                .questionText("Which algorithm finds the shortest path from a single source node in a weighted graph with non-negative edge weights?")
                .optionA("Dijkstra's Algorithm")
                .optionB("Bellman-Ford Algorithm")
                .optionC("Kruskal's Algorithm")
                .optionD("Floyd-Warshall Algorithm")
                .correctAnswer("A")
                .marks(2.0)
                .difficulty(Difficulty.HARD)
                .subject("Algorithms")
                .build();

        Question q6 = Question.builder()
                .questionText("In a dynamic array, what is the amortized time complexity of an append operation?")
                .optionA("O(N)")
                .optionB("O(1)")
                .optionC("O(log N)")
                .optionD("O(N^2)")
                .correctAnswer("B")
                .marks(2.0)
                .difficulty(Difficulty.EASY)
                .subject("Data Structures")
                .build();

        Question q7 = Question.builder()
                .questionText("Which of the following data structures allows constant time O(1) average case search, insertion, and deletion?")
                .optionA("Binary Search Tree")
                .optionB("HashTable")
                .optionC("AVL Tree")
                .optionD("Sorted Array")
                .correctAnswer("B")
                .marks(2.0)
                .difficulty(Difficulty.MEDIUM)
                .subject("Data Structures")
                .build();

        Question q8 = Question.builder()
                .questionText("What is the minimum number of queues required to implement a stack data structure?")
                .optionA("1")
                .optionB("2")
                .optionC("3")
                .optionD("4")
                .correctAnswer("B")
                .marks(2.0)
                .difficulty(Difficulty.MEDIUM)
                .subject("Data Structures")
                .build();

        Question q9 = Question.builder()
                .questionText("Which searching algorithm requires the input array to be sorted?")
                .optionA("Linear Search")
                .optionB("Binary Search")
                .optionC("Depth-First Search")
                .optionD("Breadth-First Search")
                .correctAnswer("B")
                .marks(2.0)
                .difficulty(Difficulty.EASY)
                .subject("Algorithms")
                .build();

        Question q10 = Question.builder()
                .questionText("What is the maximum number of nodes in a binary tree of height 'h' (root at height 0)?")
                .optionA("2^h - 1")
                .optionB("2^(h+1) - 1")
                .optionC("2^h")
                .optionD("2^(h-1)")
                .correctAnswer("B")
                .marks(2.0)
                .difficulty(Difficulty.MEDIUM)
                .subject("Data Structures")
                .build();

        List<Question> savedQuestions = questionRepository.saveAll(List.of(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10));

        // Sample Exam
        Exam exam = Exam.builder()
                .title("Data Structures & Algorithms Final Certification Exam")
                .description("Official CSE Department Assessment evaluating core knowledge in Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Sorting, and Searching. Managed by SecureAI ExamGuard anti-malpractice proctoring.")
                .subject("Data Structures")
                .durationMinutes(30)
                .totalMarks(20.0)
                .negativeMarks(0.5)
                .maxViolations(15)
                .randomizeQuestions(true)
                .randomizeOptions(true)
                .published(true)
                .startTime(LocalDateTime.now().minusDays(1))
                .endTime(LocalDateTime.now().plusDays(30))
                .build();

        Exam savedExam = examRepository.save(exam);

        int order = 1;
        for (Question q : savedQuestions) {
            ExamQuestion eq = ExamQuestion.builder()
                    .examId(savedExam.getId())
                    .questionId(q.getId())
                    .questionOrder(order++)
                    .build();
            examQuestionRepository.save(eq);
        }
    }
}
