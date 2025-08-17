---
title: "Algorithms"
date: 2025-07-16T10:00:00+08:00
draft: false
---

{{< details "如何在有序数组中实现二分查找？请给出多语言实现，并说明时间复杂度 `func main()` $ D(x) = \begin{cases} 1, & \text{if } x \in \mathbb{Q} \\\\ 0, & \text{if } x \notin \mathbb{Q} \end{cases} $" >}}
二分查找（Binary Search）利用元素有序的特性，每次将搜索区间折半，直到找到目标或区间为空。

{{< details "如何在有序数组中实现二分查找？请给出多语言实现，并说明时间复杂度$ O(\log n) $" >}}
<div>
$$
\begin{align*}
f(x) &= \frac{a_0}{2} + \sum_{n=1}^{\infty} \left( a_n \cos\left(\frac{2\pi n x}{L}\right) + b_n \sin\left(\frac{2\pi n x}{L}\right) \right) \\
\\
\text{其中系数为:} \\
a_n &= \frac{2}{L} \int_{0}^{L} f(x) \cos\left(\frac{2\pi n x}{L}\right) dx, \quad n \ge 0 \\
b_n &= \frac{2}{L} \int_{0}^{L} f(x) \sin\left(\frac{2\pi n x}{L}\right) dx, \quad n \ge 1
\end{align*}
$$
</div>
{{< /details >}}

- 输入：有序数组 `nums` 及目标值 `target`
- 输出：目标值在数组中的索引，若不存在则返回 `-1`
- 时间复杂度：$ O(\log n) $
- 空间复杂度：$ O(1) $

实现代码：
{{< tabs "Python,Go,Java" >}}
```python
from typing import List

def binary_search(nums: List[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```|||```go
package algo

// BinarySearch returns the index of target or -1 if not found.
func BinarySearch(nums []int, target int) int {
    left, right := 0, len(nums)-1
    for left <= right {
        mid := left + (right-left)/2
        switch {
        case nums[mid] == target:
            return mid
        case nums[mid] < target:
            left = mid + 1
        default:
            right = mid - 1
        }
    }
    return -1
}
```|||```java
public int binarySearch(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}
```{{< /tabs >}}
{{< /details >}}

{{< details "请反转单链表，并给出时间复杂度" >}}
反转单链表可通过迭代一次遍历来实现。

- 时间复杂度：$ O(n) $ 
- 空间复杂度：$ O(1) $ 

{{< tabs "Python,Go,Java" >}}
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode) -> ListNode:
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev, curr = curr, nxt
    return prev
```|||```go
type ListNode struct {
    Val  int
    Next *ListNode
}

func ReverseList(head *ListNode) *ListNode {
    var prev *ListNode
    curr := head
    for curr != nil {
        next := curr.Next
        curr.Next = prev
        prev = curr
        curr = next
    }
    return prev
}
```|||```java
public ListNode reverseList(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}
```{{< /tabs >}}
{{< /details >}}

{{< details "快速排序的原理及实现，平均时间复杂度是多少？" >}}
快速排序（Quick Sort）采用分治思想：
1. 选择基准 `pivot`；
2. 将数组划分为小于基准、等于基准和大于基准三部分；
3. 递归地排序左右子数组。

平均时间复杂度：$ O(n \log n) $ ，最坏情况：$ O(n^2) $ 。

{{< tabs "Python,Go,Java" >}}
```python
def quicksort(nums):
    if len(nums) <= 1:
        return nums
    pivot = nums[len(nums) // 2]
    left = [x for x in nums if x < pivot]
    middle = [x for x in nums if x == pivot]
    right = [x for x in nums if x > pivot]
    return quicksort(left) + middle + quicksort(right)
```|||```go
func QuickSort(nums []int) []int {
    if len(nums) <= 1 {
        return nums
    }
    pivot := nums[len(nums)/2]
    left, mid, right := []int{}, []int{}, []int{}
    for _, v := range nums {
        switch {
        case v < pivot:
            left = append(left, v)
        case v > pivot:
            right = append(right, v)
        default:
            mid = append(mid, v)
        }
    }
    return append(append(QuickSort(left), mid...), QuickSort(right)...)
}
```|||```java
public List<Integer> quickSort(List<Integer> nums) {
    if (nums.size() <= 1) return nums;
    int pivot = nums.get(nums.size() / 2);
    List<Integer> left = new ArrayList<>();
    List<Integer> mid = new ArrayList<>();
    List<Integer> right = new ArrayList<>();
    for (int n : nums) {
        if (n < pivot) left.add(n);
        else if (n > pivot) right.add(n);
        else mid.add(n);
    }
    List<Integer> res = new ArrayList<>();
    res.addAll(quickSort(left));
    res.addAll(mid);
    res.addAll(quickSort(right));
    res.addAll(quickSort(right));
    return res;
}
```{{< /tabs >}}
{{< /details >}}

