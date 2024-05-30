import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 초기화
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// collection (테이블 선택)
function collection(tableName) {
  return supabase.from(tableName);
}

// getDocs (데이터 조회)
async function getDocs(query) {
  let { data, error } = await query;
  if (error) throw error;
  return data;
}

// limit (결과 제한)
function limit(query, number) {
  return query.limit(number);
}

// onSnapshot (실시간 데이터 변경 감지)
function onSnapshot(query, callback) {
  return query.on('*', payload => {
    callback(payload.new);
  }).subscribe();
}

// orderBy (정렬)
function orderBy(query, column, direction = 'asc') {
  return query.order(column, { ascending: direction === 'asc' });
}

// query (쿼리 조합)
function query(table, ...constraints) {
  let query = collection(table);
  constraints.forEach(constraint => {
    query = constraint(query);
  });
  return query;
}

// QueryConstraint (쿼리 제약 조건)
function where(column, operator, value) {
  return (query) => {
    switch (operator) {
      case 'eq':
        return query.eq(column, value);
      case 'neq':
        return query.neq(column, value);
      case 'lt':
        return query.lt(column, value);
      case 'lte':
        return query.lte(column, value);
      case 'gt':
        return query.gt(column, value);
      case 'gte':
        return query.gte(column, value);
      case 'like':
        return query.like(column, value);
      case 'ilike':
        return query.ilike(column, value);
      case 'in':
        return query.in(column, value);
      default:
        throw new Error('Unsupported operator');
    }
  };
}

// 사용 예시
async function exampleUsage() {
    try {
        let postsQuery = query('posts', orderBy('createdAt', 'desc'), where('genreId', 'in', [1, 2, 3]));
        postsQuery = limit(postsQuery, 10);
        const posts = await getDocs(postsQuery);
        console.log(posts);
      }
    catch (error) {
    console.error('Error fetching posts:', error.message);
  }
}