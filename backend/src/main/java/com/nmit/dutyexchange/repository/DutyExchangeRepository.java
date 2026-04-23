package com.nmit.dutyexchange.repository;

import com.nmit.dutyexchange.model.DutyExchange;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DutyExchangeRepository extends MongoRepository<DutyExchange, String> {
}
