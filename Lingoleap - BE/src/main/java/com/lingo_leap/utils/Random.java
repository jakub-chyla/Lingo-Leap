package com.lingo_leap.utils;

import lombok.experimental.UtilityClass;

import java.util.concurrent.ThreadLocalRandom;

@UtilityClass
public class Random {

    public Integer getRandomFromRange(Integer start, Integer end) {
        if (start == null || end == null) {
            throw new IllegalArgumentException("Start and end cannot be null");
        }
        if (start > end) {
            throw new IllegalArgumentException("Start must be less than or equal to end");
        }
        if (start.equals(end)) {
            return start;
        }

        return ThreadLocalRandom.current().nextInt(start, end);
    }
}
