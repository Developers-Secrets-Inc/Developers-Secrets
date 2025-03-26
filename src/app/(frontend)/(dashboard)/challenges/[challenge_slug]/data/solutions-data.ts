
// Exemples de solutions pour démonstration - dans une application réelle, cela viendrait d'une API
export const EXAMPLE_SOLUTIONS = [
  {
    id: '1',
    user: {
      name: 'user123',
      avatar: 'https://github.com/user1.png',
      initials: 'U1',
    },
    title: 'Efficient Bit Manipulation Approach',
    description: 'Iterative approach using bit manipulation with O(n) complexity.',
    language: 'TypeScript',
    upvotes: 24,
    downvotes: 3,
    views: 143,
    comments: 8,
    date: new Date(2023, 3, 12),
    code: `function countMaxOrSubsets(nums: number[]): number {
  // Calculate maximum possible OR value
  let maxOr = 0;
  for (const num of nums) {
    maxOr |= num;
  }
  
  // Use dynamic programming to count subsets
  let count = 0;
  
  // Helper function for backtracking
  const backtrack = (index: number, currentOr: number) => {
    // Base case: we've considered all elements
    if (index === nums.length) {
      if (currentOr === maxOr) {
        count++;
      }
      return;
    }
    
    // Option 1: Include current element
    backtrack(index + 1, currentOr | nums[index]);
    
    // Option 2: Exclude current element
    backtrack(index + 1, currentOr);
  };
  
  backtrack(0, 0);
  return count;
}`,
  },
  {
    id: '2',
    user: {
      name: 'coder456',
      avatar: 'https://github.com/user2.png',
      initials: 'U2',
    },
    title: 'Optimized with Memoization',
    description: 'Dynamic programming solution with memoization to avoid redundant calculations.',
    language: 'JavaScript',
    upvotes: 18,
    downvotes: 2,
    views: 93,
    comments: 5,
    date: new Date(2023, 3, 15),
    code: `function countMaxOrSubsets(nums) {
  // Calculate the maximum OR value possible
  let maxOr = 0;
  for (const num of nums) {
    maxOr |= num;
  }
  
  // Initialize memoization table
  const memo = new Map();
  
  function dp(index, currentOr) {
    // Base case: reached the end
    if (index === nums.length) {
      return currentOr === maxOr ? 1 : 0;
    }
    
    // Create a unique key for memoization
    const key = \`\${index},\${currentOr}\`;
    
    // Check if we've already computed this state
    if (memo.has(key)) {
      return memo.get(key);
    }
    
    // Include current element
    const include = dp(index + 1, currentOr | nums[index]);
    
    // Exclude current element
    const exclude = dp(index + 1, currentOr);
    
    // Store the result in memo table
    const result = include + exclude;
    memo.set(key, result);
    
    return result;
  }
  
  return dp(0, 0);
}`,
  },
  {
    id: '3',
    user: {
      name: 'algopro',
      avatar: 'https://github.com/user3.png',
      initials: 'AP',
    },
    title: 'Recursive Backtracking',
    description: 'Clean implementation using recursive backtracking to explore all subsets.',
    language: 'Python',
    upvotes: 31,
    downvotes: 1,
    views: 215,
    comments: 12,
    date: new Date(2023, 3, 10),
    code: `def countMaxOrSubsets(nums):
    # Calculate maximum OR value
    max_or = 0
    for num in nums:
        max_or |= num
    
    count = 0
    
    def backtrack(index, current_or):
        nonlocal count
        
        # Base case: we've processed all elements
        if index == len(nums):
            if current_or == max_or:
                count += 1
            return
        
        # Include current element
        backtrack(index + 1, current_or | nums[index])
        
        # Exclude current element
        backtrack(index + 1, current_or)
    
    backtrack(0, 0)
    return count`,
  },
  {
    id: '4',
    user: {
      name: 'bitwise_master',
      avatar: 'https://github.com/user4.png',
      initials: 'BM',
    },
    title: 'Bitwise Magic: O(1) Approach',
    description: 'Unique approach using mathematical properties of bitwise operations.',
    language: 'C++',
    upvotes: 47,
    downvotes: 4,
    views: 312,
    comments: 19,
    date: new Date(2023, 3, 8),
    code: `int countMaxOrSubsets(vector<int>& nums) {
    // Calculate the maximum OR value
    int maxOr = 0;
    for (int num : nums) {
        maxOr |= num;
    }
    
    // Use DP to solve
    int n = nums.size();
    vector<int> dp(1 << n, 0);
    dp[0] = 1;  // Empty subset
    
    // For each bit position
    for (int i = 0; i < n; i++) {
        // For each existing subset
        for (int j = 0; j < (1 << i); j++) {
            // Add current element to the subset
            dp[j | (1 << i)] += dp[j];
        }
    }
    
    // Count subsets with maxOr value
    int count = 0;
    for (int i = 0; i < (1 << n); i++) {
        int subsetOr = 0;
        for (int j = 0; j < n; j++) {
            if (i & (1 << j)) {
                subsetOr |= nums[j];
            }
        }
        if (subsetOr == maxOr) {
            count += dp[i];
        }
    }
    
    return count;
}`,
  },
]
