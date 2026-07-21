# ARIZ State Machine

Реализован базовый линейный автомат для стадий:

1. `PART_1_PROBLEM_ANALYSIS`
2. `PART_2_CONTRADICTION_MODEL`
3. `PART_3_IKR_FORMULATION`
4. `PART_4_RESOURCE_ANALYSIS`
5. `PART_5_PRINCIPLE_SELECTION`
6. `READY_FOR_GENERATION`

## Текущее поведение

- без технического противоречия продвижение блокируется;
- при наличии противоречия шаги проходят последовательно;
- при `userApproved=true` система достигает `READY_FOR_GENERATION`.

Дальше сюда логично добавить:
- guard conditions для каждого шага;
- явные причины отклонения;
- сохранение состояния сессии;
- ручной возврат на предыдущие стадии review.
