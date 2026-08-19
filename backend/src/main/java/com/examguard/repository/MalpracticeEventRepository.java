package com.examguard.repository;

import com.examguard.entity.MalpracticeEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MalpracticeEventRepository extends JpaRepository<MalpracticeEvent, Long> {
    List<MalpracticeEvent> findByAttemptIdOrderByTimestampDesc(Long attemptId);
    List<MalpracticeEvent> findByStudentIdOrderByTimestampDesc(Long studentId);
    List<MalpracticeEvent> findAllByOrderByTimestampDesc();
}
