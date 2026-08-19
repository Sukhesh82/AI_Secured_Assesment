package com.examguard.repository;

import com.examguard.entity.ExamQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamQuestionRepository extends JpaRepository<ExamQuestion, Long> {
    List<ExamQuestion> findByExamIdOrderByQuestionOrderAsc(Long examId);
    void deleteByExamId(Long examId);
    boolean existsByExamIdAndQuestionId(Long examId, Long questionId);
}
