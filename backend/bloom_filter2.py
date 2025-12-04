import math
import hashlib

class BloomFilter2:
    def __init__(self, capacity, err_rate = 0.01):
        self.capacity = capacity
        self.err_rate = err_rate
        self.m = self._calculate_m(capacity, err_rate)

        self.k = self._calculate_k(self.m, capacity)
        
        self.bit_array = [False] * self.m
        self.count = 0

    def _calculate_m(self, n, p):
        m = -(n * math.log(p)) / (math.log(2) ** 2)
        return int(m)
        
    def _calculate_k(self, m, n):
        k = (m / n) * math.log(2)
        return int(round(k))
    
    def _get_hashes(self, item):
        item_bytes = str(item).encode('utf-8')

        h1 = int(hashlib.sha256(item_bytes).hexdigest(), 16)
        h2 = int(hashlib.md5(item_bytes).hexdigest(), 16)

        indices = []
        for i in range(self.k):
            index = (h1 + i * h2) % self.m
            indices.append(index)

            return indices
        
    def add(self, item):
        indices = self._get_hashes(item)
        for index in indices:
            self.bit_array[index] = True

        self.count += 1

    def check(self, item):
        indices = self._get_hashes(item)
        for index in indices:
            if not self.bit_array[index]:
                return False
        
        return True
    
    def clear(self):
        self.bit_array = [False] * self.m
        self.count = 0