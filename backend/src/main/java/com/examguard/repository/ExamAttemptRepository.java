package com.examguard.repository;

import com.examguard.entity.ExamAttempt;
import com.examguard.entity.enums.AttemptStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamAttemptRepository extends JpaRepository<ExamAttempt, Long> {
    List<ExamAttempt> findByStudentId(Long studentId);
    List<ExamAttempt> findByExamId(Long examId);
    Optional<ExamAttempt> findByExamIdAndStudentId(Long examId, Long studentId);
    List<ExamAttempt> findByStatus(AttemptStatus status);
    List<ExamAttempt> findByStatusIn(List<AttemptStatus> statuses);
}
