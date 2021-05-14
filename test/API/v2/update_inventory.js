module.exports = APIProvider => {
    describe('Test updateInventory method', () => {
        test('With no args response shall have property `success` = true', async () => {

            let response = await APIProvider.v2.updateInventory();
            expect(response).not.toEqual(null);
            expect(response).toHaveProperty('success');
            expect(response.success).toEqual(true);
        });
    });
};
