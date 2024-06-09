# TypeORM

## 问题/缺陷

### 1. 无法使用`user.*`查询所有字段
在多表查询时，需要明确指定查询的字段，而不能直接使用`user.*`，否则会查不到数据（返回null）。
```javascript
 const user = await this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .select(['user.id', 'user.username', 'user.email', 'user.createdAt'])
      .addSelect(['role.name', 'role.label', 'role.id'])
      .where({
        id,
      })
      .getOne();
```

### 2. 默认会创建外键索引
在创建关联关系时，TypeORM会默认创建外键限制，需要手动关闭。
```javascript
@ManyToOne(() => User, user => user.roles, {
  createForeignKeyConstraints: false
})
```
