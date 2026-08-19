package com.examguard.repository;

import com.examguard.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByPublishedTrue();
    List<Exam> findBySubject(String subject);
}
