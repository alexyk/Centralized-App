import referralIdPersister from "../service/persist-referral-id";

test("referralIdPersister", ()=>{
  global.document = {};
  referralIdPersister.tryToSetFromSearch("?refId=123&test=1");
  let id = referralIdPersister.getIdToRegister();
  expect(id).toBe("123");
})


test("referralIdPersister renews id", ()=>{
  global.document = {referralId: "12345"};
  referralIdPersister.tryToSetFromSearch("?refId=123&test=1");
  let id = referralIdPersister.getIdToRegister();
  expect(id).toBe("123");
})
