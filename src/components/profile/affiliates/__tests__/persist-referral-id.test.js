import referralIdPersister from "../service/persist-referral-id";

test("referralIdPersister", ()=>{
  global.document = {};
  referralIdPersister.tryToSetFromSearch("?refId=123&test=1");
  let id = referralIdPersister.getIdToRegister();
  expect(id).toBe("123");
})
