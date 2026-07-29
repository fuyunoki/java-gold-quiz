import type { CategoryModule } from './CategoryModule'
import { lambdaModule } from './categories/lambda'
import { streamsModule } from './categories/streams'
import { genericsModule } from './categories/generics'
import { collectionsModule } from './categories/collections'
import { exceptionsModule } from './categories/exceptions'
import { modernJavaModule } from './categories/modern-java'
import { concurrencyModule } from './categories/concurrency'
import { nio2Module } from './categories/nio2'
import { modulesModule } from './categories/modules'
import { jdbcModule } from './categories/jdbc'
import { localizationModule } from './categories/localization'
import { datetimeModule } from './categories/datetime'

/**
 * アプリが扱う全分野のデータ登録簿。
 *
 * 並び順はここでは気にしなくてよい（分野一覧は Category.order 昇順、
 * 分野内は難易度昇順で自動整列される）。
 *
 * ---- 新しい分野を追加する手順 ----
 * 1. `categories/xxx.ts` を作り、既存ファイルと同じ形で
 *    `export const xxxModule: CategoryModule = { ... } satisfies CategoryModule` を書く。
 *    - Category に `order`（学習パス上の順序）を、各 Question に `difficulty`（1〜3）を必ず付ける。
 * 2. 下の配列に import して1行追加する。
 * これだけで一覧・出題に反映される（他のコードの変更は不要）。
 */
export const categoryModules: readonly CategoryModule[] = [
  lambdaModule,
  streamsModule,
  genericsModule,
  collectionsModule,
  exceptionsModule,
  modernJavaModule,
  concurrencyModule,
  nio2Module,
  modulesModule,
  jdbcModule,
  localizationModule,
  datetimeModule,
  // 追加候補: annotations, io(java.io/シリアライズ), inner-classes ...
]
