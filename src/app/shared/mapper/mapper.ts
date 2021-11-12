export abstract class Mapper<Entity, DTO> {
  public abstract mapEntityToDTO(entity: Entity): DTO;
}
