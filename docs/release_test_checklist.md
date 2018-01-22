# Release test checklist

- [ ] Start these tests online
- [ ] Repeat offline 

## META

- [ ] login (if not already)
- [ ] logout
- [ ] login
- [ ] set instance ID
- [ ] reload - check still logged-in


## PLAN

- [ ] load a plan - should get nothing
- [ ] create a plan:
	- [ ] bulk select
	- [ ] individual select
- [ ] save plan
- [ ] clear plan
- [ ] load plan


## DEBUG/FAKE DATA

- [ ] create some fake records (few clicks)


## RECORD

- [ ] edit previously-created record
- [ ] sync records
- [ ] view previously-created record
- [ ] create record by hand (multiple paths)


## DASHBOARD

- [ ] load plan
- [ ] load responses
- [ ] sync both
- [ ] download responses
- [ ] check charts are working
- [ ] check table has % coverage values (may need to sort column)
- [ ] map can display coverage layer, coloured areas
- [ ] map click results in tooltip with info
- [ ] add/remove filters